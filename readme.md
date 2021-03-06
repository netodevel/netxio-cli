# Netxio CLI
A CLI for my development worfklow.

## Commands
  nt              -                                    
  version (v)     Output the version number            
  g:controller    Create new controller                
  g:migration     Create new Liquibase Migration       
  g:setup         Create nt.json to configure this cli 
  help (h)       

## Generate spring controllers

```nt g:controller User```
```shell 
invoke src_main
   Generated controllers/usersController
invoke test_unit
   Generated controllers/usersControllerTest
```
## Generate liquibase migrations

`nt g:migration create-table-users users`
```shell 
invoke liquibase
   Generated 2021-07-25-144358-create-table-users.xml
   Generated liquibase-changeLog.xml
```

### Multiple migration generator
`nt g:migration create-table-users users -t adc,ct`
```shell 
invoke liquibase
   Generated 2021-07-25-144358-create-table-users.xml
   Generated liquibase-changeLog.xml
```

# License
MIT - see LICENSE

