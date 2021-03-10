function removeHeaderFromRequest(header) {
    return function (data, headers) {
        delete headers.common[header];
        return data;
    };
}

export default removeHeaderFromRequest;
