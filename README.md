# My Vaadin and Vis.js tryings 

## 12.09 Что сделано? 
* Созданы классы XmlObject и LayoutProperties для работы с данными из xml. Пока что только для загрузки из xml на бэк и фронт. 
* Классы Node и Edge переименовал в VisJsNode и VisJsEdge для однозначности при работе в классе XmlObject (он использует объекты библиотечного класса Node).
* Со стороны фронта удалось добиться следующего:
    * отрисовка по узлов по координатам из xml,
    * фиксация позиции при двойном клике на узел,
    * теперь отрисовывается не исторический кнот, а исторический тай,
    * обработаны драг-н-дропы для узлов.
* Добавлены кнопки, текст поля и комбобоксы - **взаимосключающая обработка их совместной работы сейчас в проработке!**
* **Сейчас работаю над выгрузкой в XML**.
* Можно попробовать загрузить файл в директории resources/xmls/ https://github.com/zyaeen/vaadin-visjs-testing-repo/tree/main/src/main/resources/xmls

## 02.09 Что сделано? 
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
