# My Vaadin and Vis.js tryings 

## UPD. 02.09 Что сделано? 
* Для хранения инфы по узлам, их связями и их типов (анкер, кнот, тай, атрибут) была подключена бд H2. 
* Для внесения изменений на лету был заимпорчен flyway и проведены [миграции](https://github.com/zyaeen/vaadin-visjs-testing-repo/tree/main/src/main/resources/db/migration).
* Обновлены классы [Node, Edge](https://github.com/zyaeen/vaadin-visjs-testing-repo/tree/main/src/main/java/com/example/application/network), добавлены классы и интерфейсы [NodeType, NodeRepository, EdgeRepository, NodeTypeRepository](https://github.com/zyaeen/vaadin-visjs-testing-repo/tree/main/src/main/java/com/example/application/network) для выгрузки и сохранения данных в бд.
* Добавил [скрипты в файле visjs-test.js](https://github.com/zyaeen/vaadin-visjs-testing-repo/blob/main/frontend/visjs-test.js) для отрисовки анкерной модели.
* В [MainView](https://github.com/zyaeen/vaadin-visjs-testing-repo/blob/main/src/main/java/com/example/application/views/main/MainView.java) добавил комбобкс, наполняемый типами анкеров из таблицы NODE_TYPE.
* Немного изменил метод addNode в [VisJs.java](https://github.com/zyaeen/vaadin-visjs-testing-repo/blob/main/src/main/java/com/example/application/views/main/VisJs.java). Теперь при добавлении нода отправляю на фронт не айдишник, а нод целиком.
* Демонстрация работы ![Main — Яндекс Браузер 2022-09-02 21-30-36](https://user-images.githubusercontent.com/65723002/188217072-c2c60062-ef23-4c97-97c5-52d72abaeb50.gif)



## 01.09. Что сделано?
* Скачан get started проект с офиц. сайта ваадина
* Заимпорчены и использованы [методы](https://github.com/zyaeen/vaadin-visjs-testing-repo/blob/main/frontend/visjs-test.js) с помощью библиотеки vis.js 
* Реализованы классы [Edge и Node](https://github.com/zyaeen/vaadin-visjs-testing-repo/tree/main/src/main/java/com/example/application/network) для обращения с узлами и связями графа, реализован класс [VisJs](https://github.com/zyaeen/vaadin-visjs-testing-repo/blob/main/src/main/java/com/example/application/views/main/VisJs.java) для работы js-скриптами из предыдущего пункта.
* Новые узлы добавляются по нажатию кнопки Add node через поля Node ID и Connect to. Node ID - id добавляемого узла, Connect to - id существующего узла, с которым нужно соединить Node ID
* Изначальный вид графа ![image](https://user-images.githubusercontent.com/65723002/187778047-2278539a-46d8-4e8a-9f3c-15147f28d3e3.png)
* После добавления узла ![image](https://user-images.githubusercontent.com/65723002/187778426-2c434351-7093-4798-85f5-7e8d13d54fdc.png)
