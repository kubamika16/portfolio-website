import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'projectTitle',
      title: 'Project Title',
      type: 'string',
    }),
    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: {type: 'author'},
    }),
    defineField({
      name: 'projectImage',
      title: 'Project Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'projectFolder',
      title: 'Project Folder',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Project Description',
      type: 'blockContent',
    }),
    defineField({
      name: 'demoLink',
      title: 'Demo Link',
      type: 'string',
    }),
    defineField({
      name: 'githubLink',
      title: 'GitHub Link',
      type: 'string',
    }),
  ],

  preview: {
    select: {
      title: 'projectTitle',
      author: 'author.name',
      media: 'mainImage',
    },
    prepare(selection) {
      const {author} = selection
      return {...selection, subtitle: author && `by ${author}`}
    },
  },
})
