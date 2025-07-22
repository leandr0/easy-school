package br.com.easyschool.service.gateways;

import br.com.easyschool.domain.entities.RevenueMessage;
import br.com.easyschool.domain.repositories.RevenueMessageRepository;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/revenue/messages")
public class RevenueMessageGateway {

    private final Log LOG = LogFactory.getLog(this.getClass());
    private final RevenueMessageRepository repository;

    public RevenueMessageGateway(RevenueMessageRepository repository){
        this.repository = repository;
    }


    @GetMapping
    public List<RevenueMessage> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public RevenueMessage create(@RequestBody RevenueMessage revenueMessage) {

        return repository.save(revenueMessage);
    }

}
