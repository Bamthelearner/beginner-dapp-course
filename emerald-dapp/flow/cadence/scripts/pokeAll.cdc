import NamesOnFlow from "../contracts/NamesOnFlow.cdc"

pub fun main() : String {
    var string = ""
    let words = NamesOnFlow.poke_them_all()
    for name in words.keys {
        let s = name.concat(" says :  ").concat(words[name]!).concat(" /n")
        string = string.concat(s)
    }

    return string
}