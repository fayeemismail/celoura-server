export const env = {
    get JWT_ACCESS_SECRET() {
        return process.env.JWT_SECRET;
    },
    
    get JWT_REFRESH_SECRET() {
        return process.env.REFRESH_TOKEN;
    },

    get COMPANY_EMAIL() {
        return process.env.EMAIL;
    },

    get EMAIL_PASSKEY() {
        return process.env.EMAIL_PASS;
    },

    get PORT() {
        return process.env.PORT;
    },

    get REDIS_HOST() {
        return process.env.REDIS_HOST;
    },

    get REDIS_PORT() {
        return process.env.REDIS_PORT;
    },

    get ACCESS_TOKEN_EXPIRE() {
        return parseInt(process.env.ACCESS_TOKEN_EXPIRE || "900000"); // default to 15 mins
    },
    
    get REFRESH_TOKEN_EXPIRE() {
        return parseInt(process.env.REFRESH_TOKEN_EXPIRE || "604800000"); // default to 7 days
    }, 

    get NODE_ENV() {
        return process.env.NODE_ENV;
    },

    get GOOGLE_CLIENT_ID() {
        return process.env.GOOGLE_CLIENT_ID;
    },

    get GOOGLE_CLIENT_SECRET() {
        return process.env.GOOGLE_CLIENT_SECRET;
    },

    get GOOGLE_CALLBACK_URI() {
        return process.env.GOOGLE_CALLBACK_URI;
    }

};