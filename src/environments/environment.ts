// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
    production: false,
    pusher: {
        key: 'd2d7a663f7e5ebc391cb',
        cluster: 'ap2',
    },
    SITE_URL: 'http://192.168.10.93/snap_hrms/hrms-backend/api/',
    DOWNLOAD_XLS: 'http://192.168.10.93/snap_hrms/hrms-backend/',
    API_URL: 'http://192.168.10.93/snap_hrms/hrms-backend/api/',
    DOWNLOAD_FILE_URL: 'http://192.168.10.93/snap_hrms/hrms-backend/api/downloadfile/',
    DOWNLOAD_IMAGE_URL: 'http://192.168.10.93/snap_hrms/hrms-backend/api/downloadimage/',
    IMAGE_URL: 'http://192.168.10.93/snap_hrms/hrms-backend/public/upload/',
    FILE_URL: 'http://192.168.10.93/snap_hrms/hrms-backend/public/upload/files/'
};
