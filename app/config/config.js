var path = require('path');

var config = {
    debug: true,
    name: 'APP_Name',
    port: 3000,
    list_one_page_count: 10,
    pimg: path.join(__dirname, 'public', 'images'),
    upload_dir: path.join(__dirname, 'public', 'user_data', 'images'),
    site_logo: '',
    // mail SMTP
    mail_opts: {
        user: "",
        password: "",
        host: "smtp.gmail.com",
        ssl: true
    },
};

module.exports = config;
module.exports.config = config;
