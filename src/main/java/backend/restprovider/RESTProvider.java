package backend.restprovider;

import com.vaadin.flow.spring.annotation.RouteScope;
import com.vaadin.flow.spring.annotation.UIScope;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

/**
 * Implementation of a paging REST provider. Used to demonstrate lazy loading
 * data providers.
 * <p>
 * Created mainly because most 3rd party REST APIs are commercial, especially
 * for the amount of traffic a Vaadin demo needs.
 * <p>
 * The implementation here is not relevant for the Vaadin example itself, and
 * should not be taken as a production-ready implementation for REST services.
 */
@RestController
public class RESTProvider {

//    @Autowired
//    private FileStorageService fileStorageService;
//
//    @Autowired
//    private TreeStorageService treeStorageService;
//
//    @PostMapping("/upload-from-file")
//    public void handleFileUpload(@RequestParam("file") MultipartFile uploadedFile)
//        throws Exception {
//        /* Here you can do something with the uploaded file. For example:
//        File file = new File(System.getProperty("user.dir") + "/uploadedFile");
//        uploadedFile.transferTo(file);
//         */
//
//        treeStorageService.refreshStorage(uploadedFile);
//
//
////        String fileName = fileStorageService.storeFile(uploadedFile);
////
//
////        DocumentBuilder documentBuilder = DocumentBuilderFactory.newDefaultInstance().newDocumentBuilder();
////        Document document = documentBuilder.parse(uploadedFile.getInputStream());
////
////        DOMSource domSource = new DOMSource(document);
////        Transformer transformer = TransformerFactory.newInstance().newTransformer();
////        StringWriter sw = new StringWriter();
////        StreamResult sr = new StreamResult(sw);
////        transformer.transform(domSource, sr);
//    }


}