export class NotificationService {
    /**
     * Mock notification system to simulate sending notifications.
     * Can be configured to send emails, SMS, or log notifications to a file/DB.
     */
    static async sendNotification(recipientEmail, subject, message) {
        console.log(`[Notification MOCK] Sending email to ${recipientEmail}`);
        console.log(`Subject: ${subject}`);
        console.log(`Message: ${message}`);
        return true;
    }
    static async notifyStudentAssignment(studentName, studentEmail, taskName, date) {
        const subject = 'New Cleaning Assignment Assigned';
        const message = `Hello ${studentName},\n\nYou have been assigned the cleaning task: "${taskName}" scheduled for ${date}.\n\nPlease ensure you complete it on time to earn your points.\n\nBest regards,\nCRM System Admin`;
        await this.sendNotification(studentEmail, subject, message);
    }
    static async notifyStudentPunishment(studentName, studentEmail, offense, punishment, points) {
        const subject = 'Record of Discipline/Punishment Logged';
        const message = `Hello ${studentName},\n\nA discipline record has been logged in your profile.\n\nOffense: ${offense}\nAction: ${punishment}\nPoints Deducted: ${points}\n\nPlease review your dashboard for details.\n\nBest regards,\nDisciplinary Committee`;
        await this.sendNotification(studentEmail, subject, message);
    }
}
