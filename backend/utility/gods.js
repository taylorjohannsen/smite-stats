
module.exports.godsInfo = () => {
    return new Promise((resolve, reject) => {
        api.getGods()
            .then(gods => {
                resolve(gods)
            })
            .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
}

module.exports.godPortrait = (name, gods) => {
    return new Promise(async (resolve, reject) => {
        let character = await gods.find(god => { return god.Name === name })

        if (character !== undefined) {
            resolve(character.godIcon_URL)
        } else {
            resolve('')
        }
    })
    .catch(err => console.log(err))
}