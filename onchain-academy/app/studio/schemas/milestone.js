export default {
    name: 'milestone',
    title: 'Milestone',
    type: 'object',
    fields: [
        { name: 'title', title: 'Title', type: 'string' },
        { name: 'description', title: 'Description', type: 'text' },
        { name: 'xp', title: 'XP', type: 'number' },
        {
            name: 'lessons',
            title: 'Lessons',
            type: 'array',
            of: [{ type: 'lesson' }]
        }
    ]
}
