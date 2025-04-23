pipeline {
    agent any

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'PROD', url: 'https://github.com/Quindart/zalo-meta-api.git'
            }
        }

        stage('Copy .env file') {
            steps {
                configFileProvider([configFile(fileId: 'zalo-meta-api-production', targetLocation: '.env')]) {
                    sh 'ls -la && cat .env' 
                }
            }
        }

        stage('Build and Restart Docker Containers') {
            steps {
                script {
                    sh '''
                    docker-compose down
                    docker-compose up --build -d
                    '''
                }
            }
        }
    }
}
