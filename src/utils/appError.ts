class AppError extends Error {

    message: any;
    status: number;

    constructor(message: any, httpStatus: number) {
        super(message);
        this.message = message;
        this.status = httpStatus;
    }

}

export default AppError;
