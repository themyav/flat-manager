# flat-manager

## Работа по курсу "Рефакторинг баз данных и приложений"
Выбран сценарий 1: Проектирование и разработка новой программной системы

Состав команды:
* Кравцова К.В, P34081
* Батомункуева В.Ж, P34101

## Описание приложения

Веб-приложение для управления оплатой коммунальных услуг

### Внутренняя организация решения

Приложение состоит из 2 частей:

![Архитектура проекта](architecture.png)

* Клиентская часть:
    
  Веб-приложение, предоставляющее следующие возможности:
    * добавить карточку с квартирой
    * в карточке сформировать список отдельных услуг со ссылками на сайт с оплатой данной услуги и ее описанием. При возможности подрузка квитанции на оплату с указанного сайта, или с почты пользователя.
    * выписать лист с чекбоксами на конкретный месяц: какие услуги оплачены, какие нет, суммарная сумма для оплаты
    * фильтровать все категории для каждой квартиры 
    * аналитика по месяцам 


* Серверная часть:
  * REST-контроллеры для управления пользователями, их квартирами и ресурсами для оплаты
  * База данных для сохранения данных о квартирах, истории платежей (сторонних сайтов, с которыми необходимо взаимодействовать - наверное про API)
  * API для работы с сайтами для оплаты коммунальных услуг
  * Уведомления о предстоящем платеже, успешных и неуспешных транзакциях
  * Логирование всех действий связанных с оплатой
  * ...

### Пользовательские сценарии
#### Регистрация
1. Пользователь открывает приложение и выбирает опцию Регистрация.
2. Вводит личные данные: имя, email, пароль.
3. Получает подтверждение по электронной почте и завершает регистрацию.

#### Добавление карточки квартиры
1. Пользователь переходит в раздел **Квартиры** и выбирает действие **Добавить квартиру**
2. Заполняет форму карточки
3. Нажимает **Сохранить**, приложение добавляет данные о квартире в базу данных
4. Пользователь видит новую карточку в разделе **Квартиры**

#### Добавление услуги
1. Пользователь переходит в раздел **Квартиры**, переходит на нужную квартиру и выбирает действие **Добавить услугу**
2. Заполняет форму услуги
3. Нажимает **Сохранить**, приложение добавляет данные об услуге квартиры в базу данных
4. Пользователь видит новую услугу в окне квартиры
   
#### Просмотр истории платежей
1. Пользователь заходит в раздел **Квартиры** и выбирает квартиру для просмотра.
2. В окне квартиры пользователь нажимает на **История платежей**.
3. Приложение отображает список всех транзакций с датой, суммой и статусом (успешно/неуспешно).
4. Пользователь может фильтровать историю по датам или статусу транзакции.


### Группы функциональности
#### Управление пользователями
* Регистрация нового пользователя:
  * Клиент: форма для регистрации (ввод email, пароля и подтверждение email). 
  * Сервер: создание учётной записи пользователя, проверка уникальности email, отправка email для подтверждения. 
  * База данных: сохранение данных пользователя (ID, email, хеш пароля).
* Аутентификация и авторизация:
  * Клиент: форма для входа (email, пароль), управление сессией. 
  * Сервер: проверка подлинности, выдача токена JWT для защищённых запросов. 
  * База данных: хранение данных для проверки и ограничения доступа.
* Управление профилем пользователя:
  * Клиент: редактирование информации о пользователе (например, email). 
  * Сервер: обновление данных профиля пользователя. 
  * База данных: обновление данных в соответствующих таблицах.


#### Управление карточкой квартирой
* Добавление карточки квартиры:
  * Клиент: форма для добавления карточки квартиры (название, адрес, услуги).
  * Сервер: обработка данных квартиры, создание записи для квартиры. 
  * База данных: сохранение информации о квартире с привязкой к пользователю.
  
* Просмотр квартир:
  * Клиент: список всех активных карточек квартир пользователя. 
  * Сервер: запрос информации о квартирах из базы. 
  * База данных: хранение информации о квартирах (название, статус, дата, услуги).
  
* Редактирование и удаление карточки квартиры:
  * Клиент: интерфейс для редактирования параметров квартиры или её удаления. 
  * Сервер: обновление параметров квартиры или перевод её в статус "Удалена". 
  * База данных: обновление записи о квартире (новые данные или статус).


#### Управление услугами квартиры
* Добавление услуги:
  * Клиент: форма для добавления услуги квартиры (название ...).
  * Сервер: обработка данных квартиры, создание записи для услуги.
  * База данных: сохранение информации об услуге с привязкой к квартире.

* Просмотр услуг:
  * Клиент: список всех активных услуг квартиры пользователя.
  * Сервер: запрос информации об услугах квартиры из базы.
  * База данных: хранение информации об услугах квартиры (название, статус, дата, услуги).

* Редактирование и удаление услуги квартиры:
  * Клиент: интерфейс для редактирования параметров услуги или её удаления.
  * Сервер: обновление параметров услуги или перевод её в статус "Удалена".
  * База данных: обновление записи об услуге (новые данные или статус).


#### Уведомления и напоминания
* Уведомление о предстоящем платеже:
  * Сервер: регулярная проверка дат следующего платежа и создание уведомления за день до оплаты. 
  * Клиент: отображение уведомления (email или пуш-уведомление) о предстоящем списании. 
  * База данных: записи о времени отправки и типе уведомления.
  
* Уведомление об успешном платеже:
  * Сервер: после успешного платежа отправка уведомления пользователю. 
  * Клиент: отображение уведомления об успешном платеже, с деталями транзакции.
  * База данных: хранение информации об отправленных уведомлениях для истории.
  
* Уведомление о неудачном платеже и напоминание об обновлении платёжного метода:
  * Сервер: отправка уведомления при возникновении ошибки платежа, запрос на обновление платёжных данных. 
  * Клиент: отображение уведомления с возможностью перейти к обновлению платёжного метода. 
  * База данных: запись о неудачной транзакции и статусе подписки.


#### История платежей и отчётность
* Просмотр истории платежей:
  * Клиент: интерфейс для отображения списка всех платежей с датами, суммами и статусами. 
  * Сервер: запрос данных из базы о платежах пользователя. 
  * База данных: таблица истории платежей с привязкой к подпискам и пользователям.
  
* Формирование отчётов по подпискам:
  * Клиент: функция для создания отчёта (например, расходов за месяц). 
  * Сервер: обработка данных подписок и платежей, расчёт общей суммы. 
  * База данных: агрегирование данных по запросам для отчётности.
  
* Фильтрация и сортировка данных по подпискам:
  * Клиент: интерфейс для сортировки истории по дате, статусу, сумме и другим критериям. 
  * Сервер: обработка фильтров и сортировки. 
  * База данных: соответствующие запросы с фильтрами и сортировкой.

### Организация процесса разработки

Процесс разработки включает в себя:

1. Выбор технологий для создания проекта
2. Проектирование общей архитектуры проекта
3. Создание структуры таблиц базы данных
4. Создание плана работы над проектом в YouTrack
5. Разработка этапа 1 --- подробнее в отчете по этапу 1.
6. Разработка этапа 2 --- подробнее в отчете по этапу 2.
7. Разработка этапа 3 --- подробнее в отчете по этапу 3.
8. Запись демонстрационного видео.

