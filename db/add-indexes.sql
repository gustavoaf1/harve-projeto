-- Adicionar índice para a tabela usuarios (login)
CREATE INDEX IF NOT EXISTS idx_usuarios_login ON usuarios(login);

-- Adicionar índice para a tabela usuario_opcao (usuario_id)
CREATE INDEX IF NOT EXISTS idx_usuario_opcao_usuario_id ON usuario_opcao(usuario_id);

-- Adicionar restrição de unicidade para evitar duplicatas
ALTER TABLE usuario_opcao DROP CONSTRAINT IF EXISTS usuario_opcao_usuario_id_key;
ALTER TABLE usuario_opcao ADD CONSTRAINT usuario_opcao_usuario_id_key UNIQUE (usuario_id);

-- Adicionar índice para a tabela respostas (usuario_id, pergunta_id)
CREATE INDEX IF NOT EXISTS idx_respostas_usuario_pergunta ON respostas(usuario_id, pergunta_id);

-- Adicionar índice para a tabela notas (usuario_id)
CREATE INDEX IF NOT EXISTS idx_notas_usuario_id ON notas(usuario_id);

-- Adicionar restrição de unicidade para evitar duplicatas
ALTER TABLE notas DROP CONSTRAINT IF EXISTS notas_usuario_id_key;
ALTER TABLE notas ADD CONSTRAINT notas_usuario_id_key UNIQUE (usuario_id);

-- Adicionar índice para a tabela opcoes_resposta (pergunta_id)
CREATE INDEX IF NOT EXISTS idx_opcoes_resposta_pergunta_id ON opcoes_resposta(pergunta_id);

-- Analisar as tabelas para atualizar estatísticas
ANALYZE usuarios;
ANALYZE opcoes;
ANALYZE perguntas;
ANALYZE respostas;
ANALYZE usuario_opcao;
ANALYZE notas;
ANALYZE opcoes_resposta;
