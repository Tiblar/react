import { createSelector } from 'reselect'

export const makeIsConnected = () => createSelector(
    (state) => state.connection.status,
    (status) => {
        return status
    }
);