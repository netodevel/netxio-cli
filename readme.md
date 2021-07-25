# Netxio CLI
A CLI for Agile Development.

## Commands
  nt              -                              
  version (v)     Output the version number      
  g:controller    Create new controller          
  g:migration     Create new Liquibase Migration 
  help (h)        -   

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

