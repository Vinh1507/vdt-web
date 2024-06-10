echo "env.CHANGE_TARGET: ${env.CHANGE_TARGET}"
echo "env.BRANCH_NAME: ${env.BRANCH_NAME}"

pipeline {
    agent any

    environment {
        IMAGE_NAME = 'vinhbh/vdt_web'
        VDT_API_DOCKERFILE_PATH = '.'
        VDT_API_DOCKER_COMPOSE_FILE_PATH = '.'
        DOCKER_HUB_CREDENTIALS = 'dockerhub_vinhbh'
        GITHUB_CREDENTIALS = 'github-token-v3'
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
                git branch: env.BRANCH_NAME , credentialsId: env.GITHUB_CREDENTIALS, url: 'https://github.com/Vinh1507/vdt-web-config'
            }
        }
        stage('Modify file helm values') {
            steps {
                script {
                    sh "sed -i 's/^  tag.*/  tag: \"${env.TAG_NAME}\"/' helm-values/values-prod.yaml"
                }
            }
        }
        stage('Push changes to config repo') {
            steps {
                sh 'git add .'
                sh 'git commit -m "Update vdt-web helm values with new image version"'
                sh 'git config --global user.email "hoangvinh1577@gmail.com"'
                sh 'git config --global user.name "VinhBh"'
                withCredentials([gitUsernamePassword(credentialsId: env.GITHUB_CREDENTIALS, gitToolName: 'Default')]) {
                    sh "git push -u origin main"
                }
            }
            
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}
