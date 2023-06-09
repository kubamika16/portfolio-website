import {defineField, defineType} from 'sanity'
import {codeInput} from '@sanity/code-input'

const task = {
  name: 'task',
  title: 'Task',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Task Title',
      type: 'string',
    }),
    defineField({
      name: 'projectFolderName',
      title: 'Project Folder Name',
      type: 'string',
    }),
    defineField({
      name: 'introduction',
      title: 'Introduction',
      type: 'string',
    }),
    defineField({
      name: 'notes',
      title: 'Notes',
      type: 'array',
      of: [{type: 'block'}],
    }),
  ],
}

export default defineType({
  name: 'itJournal',
  title: 'IT Journal',
  type: 'document',
  fields: [
    defineField({
      name: 'journalDate',
      title: 'Journal Date',
      type: 'date',
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: {type: 'author'},
    }),
    defineField({
      name: 'tasks',
      title: 'Tasks',
      type: 'array',
      of: [task],
    }),
    defineField({
      type: 'code',
      name: 'myCodeField',
      title: 'Code with all options',
      options: {
        language: 'javascript',
        languageAlternatives: [
          {title: 'Javascript', value: 'javascript'},
          {title: 'HTML', value: 'html'},
          {title: 'CSS', value: 'css'},
        ],
        withFilename: true,
      },
    }),
  ],

  preview: {
    select: {
      title: 'journalDate',
      author: 'author.name',
      media: 'mainImage',
    },
    prepare(selection) {
      const {author} = selection
      return {...selection, subtitle: author && `by ${author}`}
    },
  },
})
