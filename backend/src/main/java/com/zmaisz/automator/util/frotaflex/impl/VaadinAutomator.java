package com.zmaisz.automator.util.frotaflex.impl;

import java.io.IOException;
import java.net.CookieManager;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.stereotype.Service;

import com.zmaisz.automator.dto.coupon.CouponUploadDTO;
import com.zmaisz.automator.model.coupon.Coupon;
import com.zmaisz.automator.model.coupon.CouponAttachmentStatus;
import com.zmaisz.automator.model.user.usergroup.UserGroup;
import com.zmaisz.automator.repository.coupon.CouponRepository;
import com.zmaisz.automator.util.frotaflex.FrotaFlexService;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class VaadinAutomator implements FrotaFlexService {

    private final CouponRepository couponRepository;

    public VaadinAutomator(CouponRepository couponRepository) {
        this.couponRepository = couponRepository;
    }

    @Override
    public void uploadCoupons(List<CouponUploadDTO> coupons, UserGroup group) {
        if (coupons == null || coupons.isEmpty()) {
            return;
        }

        if (group == null) {
            log.error("No group provided for uploading coupons");
            updateAllToError(coupons);
            return;
        }
        String username = group.getFrotaflexUser();
        String password = group.getFrotaflexPassword();

        if (username == null || password == null || username.isEmpty() || password.isEmpty()) {
            log.error("Group {} missing FrotaFlex credentials", group.getId());
            updateAllToError(coupons);
            return;
        }

        try (FrotaFlexClient client = new FrotaFlexClient(username, password)) {
            if (!client.login()) {
                log.error("Failed to login to FrotaFlex for group {}", group.getId());
                updateAllToError(coupons);
                return;
            }

            for (CouponUploadDTO dto : coupons) {
                Coupon coupon = dto.getCoupon();
                Path filePath = dto.getFile().toPath();
                String noteId = coupon.getCode();

                try {
                    boolean success = client.attachNote(noteId, filePath);
                    if (success) {
                        coupon.setStatus(CouponAttachmentStatus.ATTACHED);
                    } else {
                        coupon.setStatus(CouponAttachmentStatus.ERROR);
                        log.warn("Failed to attach note {} for group {}", noteId, group.getId());
                    }
                } catch (Exception e) {
                    coupon.setStatus(CouponAttachmentStatus.ERROR);
                    log.error("Exception attaching note {} for group {}", noteId, group.getId(), e);
                } finally {
                    coupon.setProcessedAt(LocalDateTime.now());
                    try {
                        Files.deleteIfExists(filePath);
                    } catch (IOException ignored) {
                    }
                }

                couponRepository.save(coupon);
                try {
                    Thread.sleep(500);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    break;
                }
            }
        } catch (Exception e) {
            log.error("Unexpected error during FrotaFlex batch upload", e);
            updateAllToError(coupons);
        }
    }

    private void updateAllToError(List<CouponUploadDTO> coupons) {
        for (CouponUploadDTO dto : coupons) {
            Coupon coupon = dto.getCoupon();
            coupon.setStatus(CouponAttachmentStatus.ERROR);
            couponRepository.save(coupon);
        }
    }

    private static class FrotaFlexClient implements AutoCloseable {

        private static final String BASE_URL = "https://zmaisz.frotaflex.com.br";

        private final String username;
        private final String password;
        private final HttpClient client;
        private String urlUidl;
        private String csrfToken;
        private int syncId = 0;
        private int clientId = 0;

        // Discovery nodes (defaults)
        private int nodeUser = 34;
        private int nodePass = 31;
        private int nodeBtn = 8;
        private int nodeBusca = 75;
        private int nodeGrid = 67;

        public FrotaFlexClient(String username, String password) {
            this.username = username;
            this.password = password;
            this.urlUidl = BASE_URL + "/?v-r=uidl&v-uiId=0";

            CookieManager cm = new CookieManager();
            this.client = HttpClient.newBuilder()
                    .cookieHandler(cm)
                    .followRedirects(HttpClient.Redirect.ALWAYS)
                    .build();
        }

        private String sendRpc(String rpcCalls) throws IOException, InterruptedException {
            String payload = String.format(
                    "{\"csrfToken\":\"%s\",\"rpc\":%s,\"syncId\":%d,\"clientId\":%d}",
                    csrfToken, rpcCalls, syncId++, clientId++);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(urlUidl))
                    .header("Content-Type", "application/json; charset=UTF-8")
                    .header("User-Agent",
                            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36")
                    .header("Origin", BASE_URL)
                    .header("Referer", BASE_URL + "/duplicatas")
                    .POST(HttpRequest.BodyPublishers.ofString(payload))
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            return response.body();
        }

        public boolean login() throws IOException, InterruptedException {
            HttpRequest req1 = HttpRequest.newBuilder()
                    .uri(URI.create(BASE_URL))
                    .header("User-Agent", "Mozilla/5.0")
                    .GET().build();
            client.send(req1, HttpResponse.BodyHandlers.ofString());

            HttpRequest req2 = HttpRequest.newBuilder()
                    .uri(URI.create(BASE_URL + "/?v-r=init&location=&query="))
                    .header("User-Agent",
                            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36")
                    .header("Referer", BASE_URL + "/duplicatas")
                    .GET().build();
            HttpResponse<String> respInit = client.send(req2, HttpResponse.BodyHandlers.ofString());

            Matcher mCsrf = Pattern.compile("\"Vaadin-Security-Key\":\"([^\"]+)\"").matcher(respInit.body());
            if (mCsrf.find()) {
                this.csrfToken = mCsrf.group(1);
            } else {
                return false;
            }

            Matcher mUiId = Pattern.compile("\"v-uiId\":(\\d+)").matcher(respInit.body());
            if (mUiId.find()) {
                this.urlUidl = BASE_URL + "/?v-r=uidl&v-uiId=" + mUiId.group(1);
            }

            String respNav = sendRpc(
                    "[{\"type\":\"event\",\"node\":1,\"event\":\"ui-navigate\",\"data\":{\"route\":\"\",\"query\":\"\",\"appShellTitle\":\"\",\"historyState\":{\"idx\":0},\"trigger\":\"\"}}]");

            nodeUser = findNode(respNav, "user-field", nodeUser);
            nodePass = findNode(respNav, "pass-field", nodePass);
            nodeBtn = findNode(respNav, "confirm-btn", nodeBtn);
            nodeBusca = findNode(respNav, "search-field", nodeBusca);

            Matcher mGrid = Pattern
                    .compile(
                            "\\{\"node\":(\\d+),\"type\":\"put\",\"key\":\"tag\",\"feat\":0,\"value\":\"vaadin-grid\"\\}")
                    .matcher(respNav);
            if (mGrid.find())
                nodeGrid = Integer.parseInt(mGrid.group(1));

            sendRpc(String.format(
                    "[{\"type\":\"mSync\",\"node\":%d,\"feature\":1,\"property\":\"value\",\"value\":\"%s\"},{\"type\":\"event\",\"node\":%d,\"event\":\"change\",\"data\":{}}]",
                    nodeUser, username, nodeUser));

            sendRpc(String.format(
                    "[{\"type\":\"mSync\",\"node\":%d,\"feature\":1,\"property\":\"value\",\"value\":\"%s\"},{\"type\":\"event\",\"node\":%d,\"event\":\"change\",\"data\":{}}]",
                    nodePass, password, nodePass));

            String respLogin = sendRpc(String.format(
                    "[{\"type\":\"event\",\"node\":%d,\"event\":\"click\",\"data\":{\"event.shiftKey\":false,\"event.metaKey\":false,\"event.detail\":1,\"event.ctrlKey\":false,\"event.clientX\":500,\"event.clientY\":500,\"event.altKey\":false,\"event.button\":0,\"event.screenY\":500,\"event.screenX\":500}}]",
                    nodeBtn));

            if (respLogin.contains("vaadin-notification") || respLogin.toLowerCase().contains("inv\\u00e1lido")) {
                return false;
            }

            return true;
        }

        public boolean attachNote(String noteId, Path filepath) throws IOException, InterruptedException {
            sendRpc("[{\"type\":\"event\",\"node\":1,\"event\":\"ui-navigate\",\"data\":{\"route\":\"duplicatas\",\"query\":\"\",\"appShellTitle\":\"\",\"historyState\":{\"idx\":1},\"trigger\":\"router\"}}]");

            String respSearch = sendRpc(String.format(
                    "[{\"type\":\"mSync\",\"node\":%d,\"feature\":1,\"property\":\"value\",\"value\":\"%s\"},{\"type\":\"event\",\"node\":%d,\"event\":\"input\",\"data\":{\"1\":1,\"for\":\"trailing\"}}]",
                    nodeBusca, noteId, nodeBusca));

            Matcher mImg = Pattern
                    .compile(
                            "\\{\"node\":(\\d+),\"type\":\"put\",\"key\":\"icon\",\"feat\":3,\"value\":\"fas:image\"\\}")
                    .matcher(respSearch);
            if (!mImg.find())
                return false;
            int nodeImage = Integer.parseInt(mImg.group(1));

            sendRpc(String.format(
                    "[{\"type\":\"publishedEventHandler\",\"node\":%d,\"templateEventMethodName\":\"confirmUpdate\",\"templateEventMethodArgs\":[3],\"promise\":11}]",
                    nodeGrid));

            String respDialog = sendRpc(String.format(
                    "[{\"type\":\"event\",\"node\":%d,\"event\":\"click\",\"data\":{\"event.shiftKey\":false,\"event.metaKey\":false,\"event.detail\":1,\"event.ctrlKey\":false,\"event.clientX\":332,\"event.clientY\":157,\"event.altKey\":false,\"event.button\":0,\"event.screenY\":244,\"event.screenX\":1293}},"
                            + "{\"type\":\"publishedEventHandler\",\"node\":%d,\"templateEventMethodName\":\"setDetailsVisible\",\"templateEventMethodArgs\":[null],\"promise\":12}]",
                    nodeImage, nodeGrid));

            Integer nodeBtnUpload = findNodeByMatch(respDialog, "\"btn-upload\"");
            Integer nodeDialog = findNodeByTag(respDialog, "vaadin-dialog");
            Integer nodeTabs = findNodeByTag(respDialog, "vaadin-tabs");

            if (nodeBtnUpload == null || nodeDialog == null || nodeTabs == null)
                return false;

            sendRpc(String.format(
                    "[{\"type\":\"event\",\"node\":%d,\"event\":\"opened-changed\",\"data\":{}},{\"type\":\"event\",\"node\":%d,\"event\":\"selected-changed\",\"data\":{}}]",
                    nodeDialog, nodeTabs));
            sendRpc(String.format(
                    "[{\"type\":\"publishedEventHandler\",\"node\":%d,\"templateEventMethodName\":\"updateSelectedTab\",\"templateEventMethodArgs\":[true],\"promise\":0}]",
                    nodeTabs));

            String respUploadComp = sendRpc(String.format(
                    "[{\"type\":\"event\",\"node\":%d,\"event\":\"click\",\"data\":{\"event.shiftKey\":false,\"event.metaKey\":false,\"event.detail\":1,\"event.ctrlKey\":false,\"event.clientX\":232,\"event.clientY\":504,\"event.altKey\":false,\"event.button\":0,\"event.screenY\":591,\"event.screenX\":1193}}]",
                    nodeBtnUpload));

            Integer nodeUpload = findNodeByTag(respUploadComp, "vaadin-upload");
            Integer nodeAddBtn = findNodeBySlot(respUploadComp, "add-button");
            Integer nodeInnerDialog = findNodeByTag(respUploadComp, "vaadin-dialog");
            Integer nodeOkBtn = findNodeByMatch(respUploadComp, "\"raised-button\"");

            Matcher mUri = Pattern.compile("\"uri\":\"([^\"]*/upload)\"").matcher(respUploadComp);
            if (nodeUpload == null || !mUri.find())
                return false;
            String uploadTargetUri = mUri.group(1);
            String uploadUrl = BASE_URL + "/" + uploadTargetUri;

            if (nodeInnerDialog != null)
                sendRpc(String.format("[{\"type\":\"event\",\"node\":%d,\"event\":\"opened-changed\",\"data\":{}}]",
                        nodeInnerDialog));
            if (nodeAddBtn != null)
                sendRpc(String.format(
                        "[{\"type\":\"event\",\"node\":%d,\"event\":\"click\",\"data\":{\"event.shiftKey\":false,\"event.metaKey\":false,\"event.detail\":1,\"event.ctrlKey\":false,\"event.clientX\":366,\"event.clientY\":456,\"event.altKey\":false,\"event.button\":0,\"event.screenY\":543,\"event.screenX\":1327}}]",
                        nodeAddBtn));

            sendRpc(String.format("[{\"type\":\"event\",\"node\":%d,\"event\":\"upload-start\"}]", nodeUpload));

            uploadFile(uploadUrl, filepath);

            sendRpc(String.format(
                    "[{\"type\":\"event\",\"node\":%d,\"event\":\"upload-success\",\"data\":{\"element.files\":[{\"loaded\":%d,\"held\":false,\"status\":\"\",\"xhr\":{},\"uploadTarget\":\"%s\",\"formDataName\":\"file\",\"indeterminate\":false,\"uploading\":false,\"error\":false,\"abort\":false,\"complete\":true,\"progress\":100}]}}]",
                    nodeUpload, Files.size(filepath), uploadTargetUri));

            if (nodeOkBtn != null)
                sendRpc(String.format(
                        "[{\"type\":\"event\",\"node\":%d,\"event\":\"click\",\"data\":{\"event.shiftKey\":false,\"event.metaKey\":false,\"event.detail\":1,\"event.ctrlKey\":false,\"event.clientX\":561,\"event.clientY\":559,\"event.altKey\":false,\"event.button\":0,\"event.screenY\":646,\"event.screenX\":1522}}]",
                        nodeOkBtn));

            Integer nodeClose = findNodeByMatch(respDialog, "\"close-btn\"");
            if (nodeClose != null)
                sendRpc(String.format(
                        "[{\"type\":\"event\",\"node\":%d,\"event\":\"click\",\"data\":{\"event.shiftKey\":false,\"event.metaKey\":false,\"event.detail\":1,\"event.ctrlKey\":false,\"event.clientX\":500,\"event.clientY\":100,\"event.altKey\":false,\"event.button\":0,\"event.screenY\":100,\"event.screenX\":500}}]",
                        nodeClose));

            return true;
        }

        private void uploadFile(String url, Path path) throws IOException, InterruptedException {
            String boundary = "---" + System.currentTimeMillis() + "---";
            byte[] fileBytes = Files.readAllBytes(path);

            String prefix = "--" + boundary + "\r\n" +
                    "Content-Disposition: form-data; name=\"file\"; filename=\"" + path.getFileName() + "\"\r\n" +
                    "Content-Type: image/png\r\n\r\n";
            String suffix = "\r\n--" + boundary + "--\r\n";

            byte[] prefixBytes = prefix.getBytes(StandardCharsets.UTF_8);
            byte[] suffixBytes = suffix.getBytes(StandardCharsets.UTF_8);
            byte[] body = new byte[prefixBytes.length + fileBytes.length + suffixBytes.length];

            System.arraycopy(prefixBytes, 0, body, 0, prefixBytes.length);
            System.arraycopy(fileBytes, 0, body, prefixBytes.length, fileBytes.length);
            System.arraycopy(suffixBytes, 0, body, prefixBytes.length + fileBytes.length, suffixBytes.length);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("Content-Type", "multipart/form-data; boundary=" + boundary)
                    .header("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
                    .header("Origin", BASE_URL)
                    .header("Referer", BASE_URL + "/duplicatas")
                    .POST(HttpRequest.BodyPublishers.ofByteArray(body))
                    .build();
            client.send(request, HttpResponse.BodyHandlers.ofString());
        }

        private int findNode(String text, String idValue, int def) {
            Matcher m = Pattern.compile(
                    "\\{\"node\":(\\d+),\"type\":\"put\",\"key\":\"id\",\"feat\":3,\"value\":\"" + idValue + "\"\\}")
                    .matcher(text);
            return m.find() ? Integer.parseInt(m.group(1)) : def;
        }

        private Integer findNodeByTag(String text, String tag) {
            Matcher m = Pattern
                    .compile("\\{\"node\":(\\d+),\"type\":\"put\",\"key\":\"tag\",\"feat\":0,\"value\":\"" + tag
                            + "\"\\}")
                    .matcher(text);
            return m.find() ? Integer.parseInt(m.group(1)) : null;
        }

        private Integer findNodeBySlot(String text, String slot) {
            Matcher m = Pattern
                    .compile(
                            "\\{\"node\":(\\d+),\"type\":\"put\",\"key\":\"slot\",\"feat\":3,\"value\":\"" + slot
                                    + "\"\\}")
                    .matcher(text);
            return m.find() ? Integer.parseInt(m.group(1)) : null;
        }

        private Integer findNodeByMatch(String text, String patternPart) {
            String regex = "\\{\"node\":(\\d+),\"type\":\"splice\",\"feat\":11,\"index\":0,\"add\":\\[" + patternPart
                    + "\\]\\}";
            Matcher m = Pattern.compile(regex).matcher(text);
            if (m.find())
                return Integer.parseInt(m.group(1));

            Matcher mGeneric = Pattern.compile("\\{\"node\":(\\d+),.*?\"add\":\\[" + patternPart + "\\]\\}")
                    .matcher(text);
            return mGeneric.find() ? Integer.parseInt(mGeneric.group(1)) : null;
        }

        @Override
        public void close() {
        }
    }
}
