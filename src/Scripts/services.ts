export module Services {
    export class ErrorService {
        private readonly CommonErrorMessage: string;

        constructor() {
            this.CommonErrorMessage = "Error happened.";
        }

        getDefaultErrorMessage(): string {
            return this.CommonErrorMessage;
        }

        getErrorMessage(error: any, useDefaultErrorMessageIfNull: boolean = true): string {
            if (error && error.data && error.data.errors)
                return error.data.errors[0].message;
            else if (useDefaultErrorMessageIfNull)
                return this.CommonErrorMessage;
        }
    }
}