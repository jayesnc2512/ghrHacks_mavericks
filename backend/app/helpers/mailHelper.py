import smtplib

class sendMailHelper:
    def sendMail():
    # creates SMTP session
        try:
            s = smtplib.SMTP('smtp.gmail.com', 587)
            # start TLS for security
            s.starttls()
            # Authentication
            s.login("bollywoodtoofan@gmail.com", "Toofan9699312121")
            # message to be sent
            message = "CHutiya hai tuuu"
            # sending the mail
            s.sendmail("bollywoodtoofan@gmail.com", "diassavio629@gmail.com", message)
            # terminating the session
            s.quit()
            return "mail sent"
        except Exception as e:
            print("error in sending mail \n\n",e)
