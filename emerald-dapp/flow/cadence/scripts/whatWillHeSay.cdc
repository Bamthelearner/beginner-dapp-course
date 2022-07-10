import NamesOnFlow from "../contracts/NamesOnFlow.cdc"

pub fun main(_ name : String) : String {
    return NamesOnFlow.what_will_he_say(name)
}