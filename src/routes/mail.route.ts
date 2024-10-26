import { Router, Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import emailSender from "../mail/sendMailer";

const mailRouter = Router();
const TO_ADDRESS: string = `${process.env.TO_ADDRESS}`;

mailRouter.post("/", [
    body("name").notEmpty().trim().withMessage("Name is required"),
    body("email").isEmail().trim().normalizeEmail().withMessage("Invalid email address"),
    body("subject").notEmpty().trim().withMessage("Subject is required"),
    body("message").notEmpty().trim().withMessage("Message is required"),
], async (req: Request, res: Response, next: NextFunction) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({
            success: false,
            errors: errors.array()
        });
        return;
    }

    const { name, email, subject, message } = req.body;

    try {
        await emailSender(name, email, TO_ADDRESS, subject, message);
        console.log("Email sent successfully");
        res.status(200).json({
            success: true,
            message: "Message sent successfully"
        });
        return;
    } catch (error) {
        console.error("Email sending failed:", error);
        res.status(500).json({
            success: false,
            message: "Failed to send message"
        });
        return;
    }
});

export { mailRouter };