pub contract NamesOnFlow {
    access(contract) let map : {String : String}

    pub fun what_will_he_say(_ key: String) : String {
        return self.map[key] ?? "I don't think he speaks, each him :P"
    }

    pub fun poke_them_all() : {String : String} {
        return self.map
    }

    pub fun teach_him_speak(name: String, _ speech: String) {
        self.map[name] = speech
    }

    init(){
        self.map = {
            "Jacob" : "You Noob", 
            "Bjarte" : "FIND v2 is coming soon (Yeah I am advertising again xddddddd)", 
            "Kelcoin" : "Jacob , SLEEEEEEEP" , 
            "Andrea" : "Svelte" , 
            "Bz" : "Svelte Sucks" ,
            "Dene" : "I am the big brain in EC", 
            "Support Monkey" : "I miss you , really", 
            "Bam" : "I taught them all to speak :P "
        }
    }
}