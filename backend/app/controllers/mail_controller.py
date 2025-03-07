import asyncio
import smtplib

class MailController:
    @staticmethod
    async def send_mail_controller():
        try:
            await MailController.send_mail()
        except Exception as e:
            print(f"Error in MailController.send_mail_controller: {e}")

    @staticmethod
    async def send_mail():
        try:
            # Create SMTP session
            loop = asyncio.get_event_loop()
            with await loop.run_in_executor(None, smtplib.SMTP, 'smtp.gmail.com', 587) as s:
                # Start TLS for security
                s.starttls()
                # Authentication
                s.login("practicals321@gmail.com", "#khotchu")
                # Message to be sent
                message = "CHutiya hai tuuu"
                # Sending the mail
                s.sendmail("practicals321@gmail.com", "diassavio629@gmail.com", message)
                return "Mail sent"
        except Exception as e:
            print("Error in sending mail:\n", e)
            return "Mail not sent"


    

    

# To run the coroutine, you need to use asyncio.run() or another event loop method
if __name__ == "__main__":
    asyncio.run(MailController.send_mail_controller())
