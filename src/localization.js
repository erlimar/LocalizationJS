/**
 * LocalizationJS v0.1
 *
 * Biblioteca JavaScript simples para localização
 *
 * Copyright (C) 2014 Erlimar Silva Campos (erlimar@gmail.com)
 *
 * License: MIT
 */

(function Library(global, undefined){
    "use strict";

/*
 * TODO:
 *
 *  1) Modificar os vários arrays (languages_, dictionaries_, ruleSet_)
 *     para um ÚNICO array de objetos.
 *
 *  2) Permitir o uso de REGIÃO e SUBREGIÃO, e usar REGIÃO padrão quando
 *     a SUBREGIÃO não for encontrada.
 *
 *     Ex: pt-BR  (pt: Região, BR: Sub região)
 *
 *     - Se tivermos somente 'pt' cadastrado, e solicitarmos 'pt-BR',
 *       'pt' é usado em seu lugar, por ser a REGIÃO.
 */

    var originalLanguage_ = null,
        currentLanguage_ = null,
        languages_ = [],
        dictionary_ = {},
        dictionaries_ = [],
        rules_ = {},
        ruleSet_ = [];

    // Identificando o idioma atual do navegador, se disponível
    if(originalLanguage_ === null && navigator && navigator.language)
        originalLanguage_ = navigator.language.toLowerCase();
    
    if(originalLanguage_ === null && navigator && navigator.browserLanguage)
        originalLanguage_ = navigator.browserLanguage.toLowerCase();

    currentLanguage_ = originalLanguage_;

    // Regras padrões
    var defaultRules = {

        /**
         * Com base em um número determina o INDEX em um array de strings
         * correspondente a expressão plural.
         *
         * Ex: Em pt-BR 1 é SINGULAR, >1 é PLURAL. Assim, só existem duas
         *     opções possíveis, o INDEX estará sempre na faixa de 0..1.
         *
         *     Espera-se um array com com dois valores:
         *     ARRAY => ['Singular', 'Plural'];
         */
        pluralIndex: function(number) {
            return number > 1 ? 1 : 0;
        }
    };

    rules_ = defaultRules;

    /**
     * @private
     *
     * localization#updateEnvironment
     *
     * Atualiza as variáveis internas. Utilizado pelas funções que alteram o
     * contexto da localização.
     */
    function updateEnvironment(){
        dictionary_ = {};

        if(currentLanguage_ === null)
            return;

        var index_ = languages_.indexOf(currentLanguage_);

        if(0 > index_)
            return;

        dictionary_ = dictionaries_[index_];
    };

    /**
     * @public
     *
     * localization.lang
     *
     * Atribui e/ou retorna a linguagem configurada atualmente
     */
    function lang(){
        if(arguments.length === 1 && typeof arguments[0] === typeof '') {
            var lang_ = arguments[0].toLowerCase().trim();
            if(lang_ != '')
                currentLanguage_ = lang_;
        }

        // Restaurando o idioma original
        if(arguments.length === 1 && arguments[0] === null)
            currentLanguage_ = originalLanguage_;

        updateEnvironment();

        return currentLanguage_;
    };

    /**
     * @public
     *
     * localization.translate
     *
     * Faz a tradução de uma string para a localização atual. Caso a mesma
     * não esteja disponível, a própria mensagem é retornada.
     */
    function translate(msg, pluralNumber) {
        if(typeof msg !== typeof '' && !Array.isArray(msg))
            throw new Error('localization.translate require a @string or @string[]!');

        if(Array.isArray(msg) && typeof pluralNumber !== 'number')
            throw new Error('localization.translate require a @pluralNumber for plural!');

        // Tratamento para mensagem no plural
        if(typeof pluralNumber === 'number' && Array.isArray(msg)) {

            if(typeof rules_.pluralIndex !== 'function')
                throw new Error('localization.translate internal error(#1)!');
            
            var pluralIndex_ = rules_.pluralIndex(pluralNumber);

            if(typeof pluralIndex_ !== 'number')
                throw new Error('localization.translate internal error(#3)!');

            if(pluralIndex_ >= msg.length)
                throw new Error('localization.translate @msg[] index out of bounds.');

            msg = msg[pluralIndex_];
        }
        
        if(typeof msg === typeof '')
            return msg in dictionary_ 
                ? dictionary_[msg] 
                : msg;

        throw new Error('localization.translate internal error(#4)!');
    };

    /**
     * @public
     *
     * localization.dictionary
     *
     * Atribui um dicionário de traduções para uma linguagem específica
     */
    function dictionary(lang, dictionary){
        if(typeof lang !== typeof '')
            throw new Error('localization.dictionary param @lang is invalid');

        if(typeof dictionary !== typeof {})
            throw new Error('localization.dictionary param @dictionary is invalid');

        lang = lang.toLowerCase().trim();

        var index_ = languages_.indexOf(lang);

        if(0 > index_){
            var addLangIndex_ = languages_.push(lang) - 1;
            var addLangDict_ = dictionaries_.push(dictionary) - 1;

            if(addLangIndex_ != addLangDict_)
                throw new Error('localization.dictionary internal error(#1)!');
        }else{
            if(index_ >= dictionaries_.length)
                throw new Error('localization.dictionary internal error(#2)!');

            dictionaries_[index_] = dictionary;
        }

        updateEnvironment();
    };

    /**
     * @public
     *
     * localization.rules
     *
     * Atribui as regras para uma determinada localidade
     */
     function rules(lang, rulesDef) {
        // TODO: Implementar
        if(typeof lang !== typeof '')
            throw new Error('localization.rules param @lang is invalid');

        if(typeof rulesDef !== typeof {})
            throw new Error('localization.rules param @rulesDef is invalid');

        lang = lang.toLowerCase().trim();

        var index_ = languages_.indexOf(lang);
     }

    // Publicando objeto global que disponibiliza a API
    global.localization = {
        lang: lang,
        translate: translate,
        dictionary: dictionary,
        rules: rules
    };

})(this);
