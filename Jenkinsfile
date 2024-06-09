echo "env.CHANGE_TARGET: ${env.CHANGE_TARGET}"
echo "env.BRANCH_NAME: ${env.BRANCH_NAME}"

pipeline {
    agent any

    environment {
        IMAGE_NAME = 'vinhbh/vdt-web'
        VDT_API_DOCKERFILE_PATH = '.'
        VDT_API_DOCKER_COMPOSE_FILE_PATH = '.'
        DOCKER_HUB_CREDENTIALS = 'dockerhub_vinhbh'
        GITHUB_CREDENTIALS = 'github_Vinh1507'
    }

    stages {
        stage('Checkout') {
            steps {
                script {
                    echo "Clone code from branch ${env.BRANCH_NAME}"
                    git branch: env.BRANCH_NAME, url: 'https://github.com/Vinh1507/vdt-web'
                }
                script {
                    def tagVersion = sh(script: 'git describe --tags --abbrev=0', returnStdout: true).trim()
                    env.TAG_NAME = tagVersion
                    echo "Tag version: ${env.TAG_NAME}"
                }
            }
        }
        stage('Build Image') {
            steps {
                script {
                    echo "Image version: ${env.IMAGE_NAME}:${env.TAG_NAME}"
                    sh "docker build -t ${env.IMAGE_NAME}:${env.TAG_NAME} ${VDT_API_DOCKERFILE_PATH}"
                }
            }
        }
        stage('Push to Docker Hub') {
            steps {
                // Login to Docker Hub
                withCredentials([usernamePassword(credentialsId: env.DOCKER_HUB_CREDENTIALS, passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
                    sh 'docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD'
                }
                // Push Docker image to Docker Hub
                sh "docker push ${env.IMAGE_NAME}:${env.TAG_NAME}"
            }
        }
        stage('Clone Repo Config') {
            steps {
                echo "Clone code from branch ${env.BRANCH_NAME}"
                git branch: env.BRANCH_NAME, , credentialsId: env.GITHUB_CREDENTIALS, url: 'https://github.com/Vinh1507/vdt-api-config'
            }
        }
    }
}
