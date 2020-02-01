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

module.exports.getItems = () => {
    return new Promise((resolve, reject) => {
        api.getItems()
            .then(items => {
                resolve(items)
            })
            .catch(err => console.log(err))
    })
}

module.exports.orderBans = (winFirst, banArray, gods) => {
    return new Promise(async (resolve, reject) => {
        let banObject = {}
        let win = []
        let lose = []

        if (winFirst) {
            for (let x = 0; x < banArray.length; x++) {
                let odd = isOdd(x)
                let godObj = {}

                godObj.godName = banArray[x].replace(/_/g, ' ')
                godObj.godIcon = await this.godPortrait(godObj.godName, gods)

                if (odd) {
                    lose.push(godObj)
                } else {
                    win.push(godObj)
                }
            }
        } else {
            for (let x = 0; x < banArray.length; x++) {
                let odd = isOdd(x)
                let godObj = {}

                godObj.godName = banArray[x].replace(/_/g, ' ')
                godObj.godIcon = await this.godPortrait(godObj.godName, gods)

                if (odd) {
                    win.push(godObj)
                } else {
                    lose.push(godObj)
                }
            }
        }

        banObject.winArray = win
        banObject.loseArray = lose

        resolve(banObject)
    })

    function isOdd(number) {
        if ((number % 2) === 0) {
            return false
        } else {
            return true
        }
    }
}

module.exports.getBuild = (buildArray, activeArray, items) => {
    return new Promise(async (resolve, reject) => {
        let returnObject = {}
        let finalBuild = []
        let finalActives = []

        for await (let build of buildArray) {
            let buildObject = {}
            let buildItem = items.find(item => { return item.ItemId === build })

            if (buildItem !== undefined) {
                buildObject.name = buildItem.DeviceName.replace(/\\/g, '')
                buildObject.icon = buildItem.itemIcon_URL

                finalBuild.push(buildObject)
            }
        }

        for await (let active of activeArray) {
            let activeObject = {}
            let activeItem = items.find(item => { return item.ItemId === active })

            if (activeItem !== undefined) {
                activeObject.name = activeItem.DeviceName.replace(/\\/g, '')
                activeObject.icon = activeItem.itemIcon_URL
    
                finalActives.push(activeObject)    
            }
        }

        returnObject.build = finalBuild
        returnObject.actives = finalActives

        resolve(returnObject)
    })
}