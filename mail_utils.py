from fastapi_mail import ConnectionConfig, MessageSchema, FastMail
from pydantic import EmailStr

email_config = ConnectionConfig(
    MAIL_USERNAME="vkramarenko.at.work@gmail.com",
    MAIL_PASSWORD="vwke yvva tolu rwlf",
    MAIL_FROM="vkramarenko.at.work@gmail.com",
    MAIL_PORT=587,
    MAIL_SERVER="smtp.gmail.com",
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)


async def send_confirmation_email(email: EmailStr, appointment_details: str):
    message = MessageSchema(
        subject="Appointment Confirmation",
        recipients=[email],
        body=f"Your appointment details: {appointment_details}",
        subtype="plain"
    )
    fm = FastMail(email_config)
    await fm.send_message(message)


async def send_reschedule_email(email: EmailStr, appointment_details: str, new_date: str):
    message = MessageSchema(
        subject="Appointment Rescheduled",
        recipients=[email],
        body=f"Your appointment has been rescheduled to: {new_date}. Details: {appointment_details}",
        subtype="plain"
    )
    fm = FastMail(email_config)
    await fm.send_message(message)


async def send_deletion_email(email: EmailStr, appointment_details: str):
    message = MessageSchema(
        subject="Appointment Cancelled",
        recipients=[email],
        body=f"Your appointment has been cancelled. Details: {appointment_details}",
        subtype="plain"
    )
    fm = FastMail(email_config)
    await fm.send_message(message)
