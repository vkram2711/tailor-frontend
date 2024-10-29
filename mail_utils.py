from fastapi_mail import ConnectionConfig, MessageSchema, FastMail
from pydantic import  EmailStr

from models import Appointment

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

def format_appointment_details(appointment: Appointment):
    details = f"""
    <p>Customer ID: {appointment.customer_id}</p>
    <p>Request Work: {appointment.request_work}</p>
    <p>Additional Notes: {appointment.additional_notes}</p>
    <p>Date: {appointment.date.strftime('%Y-%m-%d %H:%M:%S')}</p>
    <p>Confirmed: {appointment.confirmed}</p>
    """
    if appointment.additional_info:
        details += f"""
        <h3>Additional Info</h3>
        <p>Notes: {appointment.additional_info.notes}</p>
        <p>Preferences: {appointment.additional_info.preferences}</p>
        """
    return details


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
            <p>Name: {tailor_info['name']}</p>
            <p>Email: {tailor_info['email']}</p>
            <p>Address: {tailor_info['address']}</p>
            <p>Phone: {tailor_info['phone']}</p>
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
            <h2>Tailor Information</h2>
            <p>Name: {tailor_info['name']}</p>
            <p>Email: {tailor_info['email']}</p>
            <p>Address: {tailor_info['address']}</p>
            <p>Phone: {tailor_info['phone']}</p>
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
            <h2>Tailor Information</h2>
            <p>Name: {tailor_info['name']}</p>
            <p>Email: {tailor_info['email']}</p>
            <p>Address: {tailor_info['address']}</p>
            <p>Phone: {tailor_info['phone']}</p>
        </body>
        </html>
        """,
        subtype="html"
    )
    fm = FastMail(email_config)
    await fm.send_message(message)