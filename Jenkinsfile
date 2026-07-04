pipeline {
    agent {
        kubernetes {
            inheritFrom 'default-agent'
        }
    }

    parameters {
        choice(name: 'BRANCH_TO_BUILD_MANUAL', choices: ['main'], description: 'Pilih branch untuk build manual')
    }

    environment {
        REGISTRY = "devops-registry.nekosukuriputo.dev"
        APP_REPO_URL = "https://github.com/NekoSukuriputo/microFE.git"
        CONFIG_PATH_PROD = "nekosukuriputo.dev/microfe/overlays/production/patch-deployment-image.yaml"
    }

    stages {
        stage('Determine Branch') {
            steps {
                script {
                    if (env.ref) {
                        env.BRANCH_TO_BUILD = env.ref.split('/').last()
                    } else {
                        env.BRANCH_TO_BUILD = params.BRANCH_TO_BUILD_MANUAL
                    }
                    echo "Building for branch: ${env.BRANCH_TO_BUILD}"
                }
            }
        }
        
        stage('Checkout App Code') {
            steps {
                dir('app-code') {
                    git branch: env.BRANCH_TO_BUILD, 
                        credentialsId: 'github-pat', 
                        url: APP_REPO_URL
                }
            }
        }

        stage('Build and Push Images') {
            steps {
                dir('app-code') {
                    script {
                        def commitHash = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
                        
                        if (env.BRANCH_TO_BUILD == 'main') {
                            env.IMAGE_TAG = "v1.0.0-${commitHash}-prod"
                        } else {
                            env.IMAGE_TAG = "v1.0.0-${commitHash}-dev"
                        }
                        
                        echo "Building images with tag: ${env.IMAGE_TAG}"
                        
                        def apps = ['host', 'remote-product', 'remote-detail-cart', 'remote-checkout', 'remote-user', 'shared-store']
                        
                        for (String app : apps) {
                            def imageName = "${env.REGISTRY}/microfe-${app}"
                            echo "Building ${app}..."
                            sh "docker build -t ${imageName}:${env.IMAGE_TAG} -f ${app}/Dockerfile ${app}/"
                            sh "docker push ${imageName}:${env.IMAGE_TAG}"
                        }
                    }
                }
            }
        }
        
        stage('Update Config Repository') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'github-pat', passwordVariable: 'GIT_TOKEN', usernameVariable: 'GIT_USERNAME')]) {
                    script {
                        def configFile
                        def commitMessage

                        if (env.BRANCH_TO_BUILD == 'main') {
                            configFile = "${env.WORKSPACE}/${CONFIG_PATH_PROD}"
                            commitMessage = "Deploy microFE to PROD: ${env.IMAGE_TAG}"
                        } else {
                            configFile = "${env.WORKSPACE}/${CONFIG_PATH_DEV}" 
                            commitMessage = "Deploy microFE to DEV: ${env.IMAGE_TAG}"
                        }

                        sh "git checkout main"
                        
                        def apps = ['host', 'remote-product', 'remote-detail-cart', 'remote-checkout', 'remote-user', 'shared-store']
                        
                        // Update image tag for all 6 deployments in the patch file using yq
                        for (String app : apps) {
                            def imageName = "${env.REGISTRY}/microfe-${app}"
                            sh "yq e '(select(.metadata.name == \"microfe-${app}\") | .spec.template.spec.containers[0].image) = \"${imageName}:${env.IMAGE_TAG}\"' -i '${configFile}'"
                        }

                        sh "git config user.name 'Jenkins CI'"
                        sh "git config user.email 'jenkins@nekosukuriputo.dev'"
                        
                        sh "git add '${configFile}'" 
                        
                        def isCommitted = false
                        def gitDiffStatus = sh(returnStatus: true, script: "git diff --cached --quiet") 
                        
                        if (gitDiffStatus != 0) { 
                            sh "git commit -m \"${commitMessage}\""
                            echo "Successfully committed image tag: ${env.IMAGE_TAG}"
                            isCommitted = true
                        } else {
                            echo "File ${configFile} is up to date. Skipping git commit."
                        }
                        
                        def remoteUrl = sh(script: 'git config --get remote.origin.url', returnStdout: true).trim()
                        def authedUrl_withToken = remoteUrl.replace("https://", "https://${GIT_USERNAME}:${GIT_TOKEN}@")
                        
                        if (isCommitted) {
                            sh "git pull --rebase ${authedUrl_withToken} main"
                            sh "git push ${authedUrl_withToken} HEAD:main"
                            echo "Configuration pushed successfully. Argo CD will now sync."
                        } else {
                            echo "No changes were committed. Skipping git pull and push."
                        }
                    }
                }
            }
        }
    }
}
