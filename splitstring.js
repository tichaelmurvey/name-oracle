db.names.updateMany(
    {},
    { $rename: {'Type':'type', 'Setting':'setting','Role':'role'} }
  )