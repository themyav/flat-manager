package com.rdba.flat_manager.service;

import com.rdba.flat_manager.entity.*;
import com.rdba.flat_manager.repo.UtilityRepository;
import org.springframework.mail.MailAuthenticationException;
import org.springframework.mail.MailException;
import org.springframework.mail.MailSendException;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;


@Service
public class ReminderService {

    private final UtilityRepository utilityRepository;
    private final JavaMailSender mailSender;

    public ReminderService(UtilityRepository utilityRepository, JavaMailSender mailSender) {
        this.utilityRepository = utilityRepository;
        this.mailSender = mailSender;
    }

    @Scheduled(cron = "0 0 9 * * ?") // Запускать каждый день в 9:00 утра (настройте по своему усмотрению)
//    @Scheduled(cron = "0 * * * * ?")
    public void sendPaymentReminders() {
        ZonedDateTime now = ZonedDateTime.now();
        ZonedDateTime threeDaysBefore = now.plusDays(3); // Дата, за 3 дня до которой нужно отправить напоминание

        List<Utility> utilities = utilityRepository.findUtilitiesByDateBetween(now, threeDaysBefore);

        for (Utility utility : utilities) {
            if (utility.getDate().isAfter(now)) {
                User user = utility.getFlat().getUser(); // Получаем пользователя, связанного с квартирой
                sendReminderEmail(user, utility);
            }
        }
    }


    private void sendReminderEmail(User user, Utility utility) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setSubject("Напоминание об оплате коммунальных услуг");
        message.setText(
                "Здравствуйте, " + user.getFirstName() + "!\n\n" +
                        "Напоминаем вам об оплате коммунальных услуг (" + utility.getName() + ") " +
                        "в размере " + utility.getPrice() + " до " + utility.getDate() + ".\n\n" +
                        "Ссылка для оплаты: " + utility.getPaymentUrl() + "\n\n" +
                        "С уважением,\nВаша управляющая компания"
        );

        try {
            mailSender.send(message);
            System.out.println("Reminder sent to " + user.getEmail());
        } catch (MailAuthenticationException e) {
            System.err.println("Authentication failed ghhh for " + user.getEmail() + ": " + e.getLocalizedMessage());
        } catch (MailSendException e) {
            System.err.println("Failed to send email to " + user.getEmail() + ": " + e.getMessage());
            for (Map.Entry<Object, Exception> entry : e.getFailedMessages().entrySet()) {
                System.err.println("  Failed message: " + entry.getKey());
                System.err.println("  Exception: " + entry.getValue());
            }
        } catch (MailException e) {
            System.err.println("General mail exception for " + user.getEmail() + ": " + e.getMessage());
        } catch (Exception e) {
            System.err.println("Unexpected error sending email to " + user.getEmail() + ": " + e.getMessage());
        }

    }
}