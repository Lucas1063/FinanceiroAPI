import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Eye, EyeOff, Calculator, ArrowLeft } from 'lucide-react'
import { authService } from '../services/authService'

const Register = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const password = watch('password')

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      await authService.register({
        nome: data.nome,
        email: data.email,
        senhaHash: data.password
      })
      
      toast.success('Conta criada com sucesso! Faça login para continuar.')
      navigate('/login')
    } catch (error) {
      toast.error('Erro ao criar conta. Tente novamente.')
      console.error('Register error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-primary-600 rounded-full flex items-center justify-center">
            <Calculator className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Crie sua conta
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Ou{' '}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
            >
              faça login em sua conta existente
            </Link>
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow-xl rounded-xl">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
                Nome completo
              </label>
              <input
                type="text"
                className="input"
                placeholder="Seu nome completo"
                {...register('nome', {
                  required: 'Nome é obrigatório',
                  minLength: {
                    value: 2,
                    message: 'Nome deve ter pelo menos 2 caracteres'
                  }
                })}
              />
              {errors.nome && (
                <p className="text-sm text-danger-600 mt-1">{errors.nome.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                className="input"
                placeholder="seu@email.com"
                {...register('email', {
                  required: 'Email é obrigatório',
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Email inválido'
                  }
                })}
              />
              {errors.email && (
                <p className="text-sm text-danger-600 mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input pr-10"
                  placeholder="Crie uma senha"
                  {...register('password', {
                    required: 'Senha é obrigatória',
                    minLength: {
                      value: 6,
                      message: 'Senha deve ter pelo menos 6 caracteres'
                    }
                  })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-danger-600 mt-1">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar senha
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="input pr-10"
                  placeholder="Confirme sua senha"
                  {...register('confirmPassword', {
                    required: 'Confirmação de senha é obrigatória',
                    validate: value =>
                      value === password || 'As senhas não coincidem'
                  })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-danger-600 mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                {...register('terms', {
                  required: 'Você deve aceitar os termos de serviço'
                })}
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                Eu concordo com os{' '}
                <a href="#" className="text-primary-600 hover:text-primary-500">
                  Termos de Serviço
                </a>{' '}
                e{' '}
                <a href="#" className="text-primary-600 hover:text-primary-500">
                  Política de Privacidade
                </a>
              </label>
            </div>
            {errors.terms && (
              <p className="text-sm text-danger-600">{errors.terms.message}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn btn-primary py-3 text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Criando conta...
                </div>
              ) : (
                'Criar conta'
              )}
            </button>
          </form>
        </div>

        <div className="text-center">
          <Link
            to="/login"
            className="inline-flex items-center text-sm text-primary-600 hover:text-primary-500 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Voltar para o login
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Register