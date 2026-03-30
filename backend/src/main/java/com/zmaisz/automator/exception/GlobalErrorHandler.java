package com.zmaisz.automator.exception;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import com.zmaisz.automator.exception.admin.InvalidTokenException;
import com.zmaisz.automator.exception.admin.TokenNotFoundException;
import com.zmaisz.automator.exception.user.IncorrectPasswordException;
import com.zmaisz.automator.exception.user.UserAlreadyExistsException;
import com.zmaisz.automator.exception.user.UserNotFoundException;
import com.zmaisz.automator.exception.user.usergrop.UserGroupAlreadyExistsException;
import com.zmaisz.automator.exception.user.usergrop.UserGroupIsNotEmptyException;
import com.zmaisz.automator.exception.user.usergrop.UserGroupNotFoundException;

@ControllerAdvice
public class GlobalErrorHandler {

	@ExceptionHandler(Exception.class)
	public ResponseEntity<ErrorResponseDTO> handleGlobalException(Exception ex, WebRequest request) {
		ex.printStackTrace();
		ErrorResponseDTO errorResponse = new ErrorResponseDTO(
				LocalDateTime.now(),
				ex.getMessage());
		return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
	}

	@ExceptionHandler(UserNotFoundException.class)
	public ResponseEntity<ErrorResponseDTO> handleUserNotFoundException(UserNotFoundException ex,
			WebRequest request) {
		ErrorResponseDTO errorResponse = new ErrorResponseDTO(
				LocalDateTime.now(),
				ex.getMessage());
		return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
	}

	@ExceptionHandler(UserAlreadyExistsException.class)
	public ResponseEntity<ErrorResponseDTO> handleUserAlreadyExistsException(UserAlreadyExistsException ex,
			WebRequest request) {
		ErrorResponseDTO errorResponse = new ErrorResponseDTO(
				LocalDateTime.now(),
				ex.getMessage());
		return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT);
	}

	@ExceptionHandler(UserGroupAlreadyExistsException.class)
	public ResponseEntity<ErrorResponseDTO> handleUserGroupAlreadyExistsException(
			UserGroupAlreadyExistsException ex,
			WebRequest request) {
		ErrorResponseDTO errorResponse = new ErrorResponseDTO(
				LocalDateTime.now(),
				ex.getMessage());
		return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT);
	}

	@ExceptionHandler(UserGroupNotFoundException.class)
	public ResponseEntity<ErrorResponseDTO> handleUserGroupNotFoundException(UserGroupNotFoundException ex,
			WebRequest request) {
		ErrorResponseDTO errorResponse = new ErrorResponseDTO(
				LocalDateTime.now(),
				ex.getMessage());
		return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
	}

	@ExceptionHandler(UserGroupIsNotEmptyException.class)
	public ResponseEntity<ErrorResponseDTO> handleUserGroupIsNotEmptyException(UserGroupIsNotEmptyException ex,
			WebRequest request) {
		ErrorResponseDTO errorResponse = new ErrorResponseDTO(
				LocalDateTime.now(),
				ex.getMessage());
		return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT);
	}

	@ExceptionHandler(IncorrectPasswordException.class)
	public ResponseEntity<ErrorResponseDTO> handleIncorrectPasswordException(IncorrectPasswordException ex,
			WebRequest request) {
		ErrorResponseDTO errorResponse = new ErrorResponseDTO(
				LocalDateTime.now(),
				ex.getMessage());
		return new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED);
	}

	@ExceptionHandler(TokenNotFoundException.class)
	public ResponseEntity<ErrorResponseDTO> handleTokenNotFoundException(TokenNotFoundException ex,
			WebRequest request) {
		ErrorResponseDTO errorResponse = new ErrorResponseDTO(
				LocalDateTime.now(),
				ex.getMessage());
		return new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED);
	}

	@ExceptionHandler(InvalidTokenException.class)
	public ResponseEntity<ErrorResponseDTO> handleInvalidTokenException(InvalidTokenException ex,
			WebRequest request) {
		ErrorResponseDTO errorResponse = new ErrorResponseDTO(
				LocalDateTime.now(),
				ex.getMessage());
		return new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED);
	}

	@ExceptionHandler(MaxUploadSizeExceededException.class)
	public ResponseEntity<ErrorResponseDTO> handleMaxUploadSizeExceededException(MaxUploadSizeExceededException ex,
			WebRequest request) {
		ErrorResponseDTO errorResponse = new ErrorResponseDTO(
				LocalDateTime.now(),
				"O tamanho máximo de upload é de 100MB e 10 arquivos por upload.");
		return new ResponseEntity<>(errorResponse, HttpStatus.CONTENT_TOO_LARGE);
	}
}
