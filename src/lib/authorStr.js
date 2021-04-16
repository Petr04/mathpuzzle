function authorStr(task) {
    const name = task.author.first_name
        + ' ' + task.author.last_name;

    return 'Автор: '
        + (task.author.email == this.$store.state.email
        ? `Вы (${name})`
        : name);
}

export default authorStr;
