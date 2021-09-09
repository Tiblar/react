import {
    UPDATE_FILES,
    UPDATE_POST_TYPE,
    UPDATE_SHAKE,
    UPDATE_ERROR,
    UPDATE_POLL_QUESTION,
    UPDATE_POLL_OPTION,
    UPDATE_MAGNET,
    UPDATE_SIZE_ERROR,
    UPDATE_BOOSTED,
    UPDATE_LARGE_FILES,
    UPDATE_LARGE_FILE_STATUS,
    UPDATE_LARGE_FILE_PART,
    UPDATE_LARGE_FILE_TOTAL,
} from "../context";

function manageReducer(state, action) {
    switch (action.type) {
        case UPDATE_FILES:
            return {...state, files: action.payload};
        case UPDATE_LARGE_FILES:
            return {...state, largeFiles: action.payload};
        case UPDATE_LARGE_FILE_STATUS:
            return {...state, largeFileStatus: action.payload};
        case UPDATE_LARGE_FILE_PART:
            return {...state, largeFilePart: action.payload};
        case UPDATE_LARGE_FILE_TOTAL:
            return {...state, largeFileTotal: action.payload};
        case UPDATE_POST_TYPE:
            return {...state, type: action.payload};
        case UPDATE_SHAKE:
            return {...state, shake: action.payload};
        case UPDATE_ERROR:
            return {...state, error: action.payload};
        case UPDATE_SIZE_ERROR:
            return {...state, sizeError: action.payload};
        case UPDATE_POLL_QUESTION:
            return {
                ...state,
                poll: {
                    ...state.poll,
                    question: action.payload,
                }
            };
        case UPDATE_POLL_OPTION:
            return {
                ...state,
                poll: {
                    ...state.poll,
                    options: {
                        ...state.poll.options,
                        [action.option]: action.payload,
                    },
                }
            };
        case UPDATE_MAGNET:
            return {
              ...state,
              magnet: action.payload,
            };
        case UPDATE_BOOSTED:
            return {...state, isBoosted: action.payload};
        default: {
            return {...state};
        }
    }
}

export default manageReducer;
