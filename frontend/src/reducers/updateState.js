function updateState(state, action) {
    if (action.type === 'changeState') {
        return action.payload
    }
}

export default updateState