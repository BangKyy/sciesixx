const getOtp = (len=6) => {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < len; i++ ) {
        otp += digits[Math.floor(Math.random() * digits.length)];
    }
    return otp;
};

export {
    getOtp
};