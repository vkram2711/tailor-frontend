import os

from dotenv import load_dotenv
from fastapi_mail import ConnectionConfig, MessageSchema, FastMail
from pydantic import EmailStr

from models import Appointment

load_dotenv()

email_config = ConnectionConfig(
    MAIL_USERNAME=os.getenv("MAIL_USERNAME"),
    MAIL_PASSWORD=os.getenv("MAIL_PASSWORD"),
    MAIL_FROM=os.getenv("MAIL_FROM"),
    MAIL_PORT=587,
    MAIL_SERVER="smtp.gmail.com",
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)


def format_tailor_info(tailor_info):
    return f"""
    <h2>Tailor Information</h2>
    {f"<p>Name: {tailor_info['name']}</p>" if tailor_info['name'] else ''}
    {f"<p>Email: {tailor_info['email']}</p>" if tailor_info['email'] else ''}
    {f"<p>Address: {tailor_info['address']}</p>" if tailor_info['address'] else ''}
    {f"<p>Phone: {tailor_info['phone']}</p>" if tailor_info['phone'] else ''}
    """


def format_appointment_details(appointment: Appointment):
    details = f"""
    <p>Customer ID: {appointment.customer_id}</p>
    <p>Request Work: {appointment.request_work}</p>
    <p>Additional Notes: {appointment.additional_notes}</p>
    <p>Date: {appointment.date.strftime('%Y-%m-%d %H:%M:%S')}</p>
    """
    if appointment.additional_notes:
        details += f"""
        <h3>Additional Info</h3>
        <p>Notes: {appointment.additional_notes:}</p>
        """
    return details


async def send_appointment_creation_email(email: EmailStr, appointment: Appointment):
    appointment_details = format_appointment_details(appointment)
    message = MessageSchema(
        subject="Appointment Created",
        recipients=[email],
        body=f"""
            <html>
            <body>
                <h1>Appointment Confirmation</h1>
                <p>Your appointment details:</p>
                {appointment_details}
                <hr>
            </body>
            </html>
            """,
        subtype="html"
    )
    fm = FastMail(email_config)
    await fm.send_message(message)


async def send_confirmation_email(email: EmailStr, appointment: Appointment, tailor_info: dict):
    appointment_details = format_appointment_details(appointment)
    message = MessageSchema(
        subject="Appointment Confirmation",
        recipients=[email],
        body=f"""
        <html>
        <body>
            <h1>Appointment Confirmation</h1>
            <p>Your appointment details:</p>
            {appointment_details}
            <hr>
            <h2>Tailor Information</h2>
            {format_tailor_info(tailor_info)}
        </body>
        </html>
        """,
        subtype="html"
    )
    fm = FastMail(email_config)
    await fm.send_message(message)


async def send_reschedule_email(email: EmailStr, appointment: Appointment, new_date: str, tailor_info: dict):
    appointment_details = format_appointment_details(appointment)
    message = MessageSchema(
        subject="Appointment Rescheduled",
        recipients=[email],
        body=f"""
        <html>
        <body>
            <h1>Appointment Rescheduled</h1>
            <p>Your appointment has been rescheduled to: {new_date}</p>
            {appointment_details}
            <hr>
            {format_tailor_info(tailor_info)}
        </body>
        </html>
        """,
        subtype="html"
    )
    fm = FastMail(email_config)
    await fm.send_message(message)


async def send_deletion_email(email: EmailStr, appointment: Appointment, tailor_info: dict):
    appointment_details = format_appointment_details(appointment)
    message = MessageSchema(
        subject="Appointment Cancelled",
        recipients=[email],
        body=f"""
        <html>
        <body>
            <h1>Appointment Cancelled</h1>
            <p>Your appointment has been cancelled.</p>
            {appointment_details}
            <hr>
            {format_tailor_info(tailor_info)}
        </body>
        </html>
        """,
        subtype="html"
    )

    fm = FastMail(email_config)
    await fm.send_message(message)
