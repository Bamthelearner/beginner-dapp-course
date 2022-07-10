import NamesOnFlow from "../contracts/NamesOnFlow.cdc"

transaction(name: String, speech: String) {
    prepare(account : AuthAccount) {}
    execute{
        NamesOnFlow.teach_him_speak(name: name, speech)
    }
}