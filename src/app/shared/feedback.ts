export class Feedback {
    firstname: string;
    lastname: string;
    telnum: number;
    email: string;
    agree: boolean;
    contacttype: string;
    message: string;

    constructor(){
        this.firstname = '';
        this.lastname = '';
        this.telnum = 0;
        this.email = '';
        this.agree = false;
        this.contacttype = 'None';
        this.message = ''; 
    }
}

export const ContactType = ['None', 'Tel', 'Email'];