var fs = require('fs');

module.exports = function () {
    fs.readFile('./google-services.json', 'utf-8', function (err, data) {
        if (err) throw err;

        var data = JSON.parse(data);

        data.project_info = {
            project_info: {
                project_number: process.env.FIREBASE_GCM_SENDER_ID,
                firebase_url: process.env.FIREBASE_DATABASE_URL,
                project_id: process.env.FIREBASE_PROJECT_ID,
                storage_bucket: process.env.FIREBASE_GOOGLE_STORAGE_BUCKET
            }
        }

        data.client[0] = {
            client_info: {
                mobilesdk_app_id: process.env.FIREBASE_GOOGLE_APP_ID,
                android_client_info: {
                    package_name: process.env.FIREBASE_PACKAGE_NAME
                }
            },
            oauth_client: [{
                    client_id: process.env.FIREBASE_WEB_CLIENT_ID,
                    client_type: 1,
                    android_info: {
                        package_name: process.env.FIREBASE_PACKAGE_NAME,
                        certificate_hash: process.env.FIREBASE_CERTIFICATE_HASH
                    }
                },
                {
                    client_id: process.env.FIREBASE_WEB_CLIENT_ID,
                    client_type: 3
                }
            ],
            api_key: [{
                current_key: process.env.FIREBASE_GOOGLE_API_KEY
            }],
            services: {
                appinvite_service: {
                    other_platform_oauth_client: [{
                        client_id: process.env.FIREBASE_WEB_CLIENT_ID,
                        client_type: 3
                    }]
                }
            }
        }

        fs.writeFile('./google-services.json', JSON.stringify(data), (err) => {
            if (err) throw err;
        })
    })
};