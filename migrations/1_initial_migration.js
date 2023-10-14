const landRegContract = artifacts.require("LandRegistration")

module.exports = (deployer) => {
    deployer.deploy(landRegContract);
}