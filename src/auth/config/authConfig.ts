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
        return process.env.PORT 
    }

}