LocalizationJS
==============

Biblioteca JavaScript simples para localização

## 1. Você desenvolve normalmente assim

```js
var message = 'Alô mundo!';
alert(message);
```

## 2. Prepare o ambiente

```js
var T = localization.translate;

var message  T('Alô mundo!');
alert(message);
```

Tudo continua como está, mas o ambiente já está preparado.
Supondo que você está em um navegador configurado para o idioma 'pt-BR'. Mas você deseja que
usuários dos Estados Unidos vejam a mensagem em seu idioma quando acessarem seu site.


### 2.1. Traduza suas mensagens

```js
localization.dictionary('en-US', {
    'Alô mundo!': 'Hello world!'
});
```

Pronto! Quando o usuário com um navegador configurado para o idioma 'en-US' acessar seu site, verá a
mensagem traduzida para `Hello world!`!

### 2.2. Se preferir

Se preferir, pode forçar um idioma para verificar o resultado.

```js
localization.lang('en-US');
```
