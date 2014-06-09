var path = require('path');

var config = {
    debug: true,
    name: 'PhotoShare',
    port: 3000,
    host: 'localhost:3000',
    list_one_page_count: 10,
    pimg: path.join(__dirname, 'public', 'images'),
    upload_dir: path.join(__dirname, '..', 'public', 'uploaded', 'files'),
    upload_url: path.join('/', 'uploaded', 'files'),
    site_logo: '',
    // mail SMTP
    mail_opts: {
        user: "",
        password: "",
        host: "smtp.gmail.com",
        ssl: true
    },
    getImagePath: function(shortPath) {
        return path.join(this.upload_dir, shortPath);
    },
    getImageUrl: function(shortPath) {
        return path.join(this.host, this.upload_url, shortPath);
    }
};

module.exports = config;
module.exports.config = config;
