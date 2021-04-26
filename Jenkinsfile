pipeline {
  agent none

  stages {
    stage('Install packages & lint & run tests') {
      agent {
        dockerfile {
          filename 'Dockerfile'
          dir 'test'
        }
      }

      steps {
        sh 'npm install -f'
        sh 'npm run lint'
        sh 'npm run test'
      }

      post {
        always {
          deleteDir() /* clean up our workspace */
        }
      }
    }

    stage('Deliver Docker images') {
      when { branch 'main' }
      agent {
        docker {
          image 'docker:19.03.12-dind'
          args '-e DOCKER_HOST=$DOCKER_HOST'
        }
      }

      steps {
        script {
          def dockerImage = docker.build 'linagora/esn-frontend-inbox'
          docker.withRegistry('', 'dockerHub') {
            dockerImage.push('branch-main')
          }
        }
      }

      post {
        success {
            echo 'Build OpenPaas front Docker image'
            build wait: false, job: 'openpaas-front/main'
        }
      }
    }
  }
}
