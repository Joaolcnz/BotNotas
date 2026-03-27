pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build') {
            steps {
                echo 'Building Docker images...'
                bat 'docker-compose build --no-cache'
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying containers...'
                bat 'docker-compose up -d'
            }
        }

        stage('Cleanup') {
            steps {
                echo 'Cleaning up dangling Docker images...'
                bat 'docker image prune -f'
            }
        }
    }

    post {
        success {
            echo 'Deployment successful!'
        }
        failure {
            echo 'Deployment failed!'
        }
    }
}
