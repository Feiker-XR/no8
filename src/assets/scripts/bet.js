export default class Bet {
  constructor ({playName, groupName, ruleId, ruleName, ruleOdds, amount}) {
    this.playName = playName
    this.groupName = groupName
    this.ruleId = ruleId
    this.ruleName = ruleName
    this.ruleOdds = ruleOdds
    this.amount = amount
  }
}
