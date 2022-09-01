# My Vaadin and Vis.js tryings 

## Что сделано?
* Скачан get started проект с офиц. сайта ваадина
* Заимпорчены и использованы [методы](https://github.com/zyaeen/vaadin-visjs-testing-repo/blob/main/frontend/visjs-test.js) с помощью библиотеки vis.js 
* Реализованы классы [Edge и Node](https://github.com/zyaeen/vaadin-visjs-testing-repo/tree/main/src/main/java/com/example/application/network) для обращения с узлами и связями графа, реализован класс [VisJs](https://github.com/zyaeen/vaadin-visjs-testing-repo/blob/main/src/main/java/com/example/application/views/main/VisJs.java) для работы js-скриптами из предыдущего пункта.
* Новые узлы добавляются по нажатию кнопки Add node через поля Node ID и Connect to. Node ID - id добавляемого узла, Connect to - id существующего узла, с которым нужно соединить Node ID
* Изначальный вид графа ![image](https://user-images.githubusercontent.com/65723002/187778047-2278539a-46d8-4e8a-9f3c-15147f28d3e3.png)
* После добавления узла ![image](https://user-images.githubusercontent.com/65723002/187778426-2c434351-7093-4798-85f5-7e8d13d54fdc.png)
